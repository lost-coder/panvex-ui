import { PageHeader } from "@/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { TokenList } from "@/compositions/TokenList";
import type { EnrollmentTokensPageProps } from "@/types/pages";

export function EnrollmentTokensPage({
  tokens,
  onCreateToken,
  onRevoke,
}: EnrollmentTokensPageProps) {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Enrollment Tokens"
        subtitle={`${tokens.length} token${tokens.length !== 1 ? "s" : ""}`}
        trailing={
          <Button size="sm" onClick={onCreateToken}>
            + New Token
          </Button>
        }
      />

      <div className="px-4 md:px-8 pb-8">
        <TokenList tokens={tokens} onRevoke={onRevoke} />
      </div>
    </div>
  );
}
