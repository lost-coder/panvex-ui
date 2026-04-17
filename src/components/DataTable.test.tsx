import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTable, type DataTableColumn } from "./DataTable";

interface Row {
  id: string;
  name: string;
  count: number;
}

const rows: Row[] = [
  { id: "1", name: "alpha", count: 10 },
  { id: "2", name: "beta", count: 5 },
];

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Name", render: (r) => r.name, sortable: true },
  { key: "count", header: "Count", render: (r) => String(r.count), sortable: true },
  { key: "static", header: "Info", render: () => "—" },
];

describe("DataTable a11y (P2-FE-07 / M-F6)", () => {
  it("marks sortable headers with scope=col and aria-sort=none by default", () => {
    render(<DataTable columns={columns} data={rows} keyExtractor={(r) => r.id} />);
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const countHeader = screen.getByRole("columnheader", { name: /count/i });
    expect(nameHeader).toHaveAttribute("scope", "col");
    expect(nameHeader).toHaveAttribute("aria-sort", "none");
    expect(countHeader).toHaveAttribute("aria-sort", "none");
  });

  it("omits aria-sort on non-sortable columns", () => {
    render(<DataTable columns={columns} data={rows} keyExtractor={(r) => r.id} />);
    const staticHeader = screen.getByRole("columnheader", { name: /info/i });
    // scope=col still applied for semantic structure
    expect(staticHeader).toHaveAttribute("scope", "col");
    expect(staticHeader).not.toHaveAttribute("aria-sort");
  });

  it("flips aria-sort between ascending and descending on consecutive clicks", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={rows} keyExtractor={(r) => r.id} />);
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });

    await user.click(nameHeader);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

    await user.click(nameHeader);
    expect(nameHeader).toHaveAttribute("aria-sort", "descending");
  });

  it("resets previously sorted column to aria-sort=none when a different column becomes active", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={rows} keyExtractor={(r) => r.id} />);
    const nameHeader = screen.getByRole("columnheader", { name: /name/i });
    const countHeader = screen.getByRole("columnheader", { name: /count/i });

    await user.click(nameHeader);
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");

    await user.click(countHeader);
    expect(countHeader).toHaveAttribute("aria-sort", "ascending");
    expect(nameHeader).toHaveAttribute("aria-sort", "none");
  });

  it("renders empty message when data is empty", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(r) => r.id}
        emptyMessage="Nothing here"
      />,
    );
    // Both desktop and mobile copies render; queryAllByText verifies at least one exists.
    expect(screen.getAllByText("Nothing here").length).toBeGreaterThan(0);
  });

  it("invokes onRowClick when row is clicked", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={rows}
        keyExtractor={(r) => r.id}
        onRowClick={onRowClick}
      />,
    );
    // Click the desktop <tr> via the visible "alpha" cell.
    await user.click(screen.getAllByText("alpha")[0]);
    expect(onRowClick).toHaveBeenCalled();
  });
});
