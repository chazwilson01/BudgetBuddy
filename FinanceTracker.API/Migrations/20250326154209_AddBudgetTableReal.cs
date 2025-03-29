using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinanceTracker.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBudgetTableReal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Budget",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    userId = table.Column<int>(type: "integer", nullable: false),
                    Income = table.Column<int>(type: "integer", nullable: false),
                    Rent = table.Column<int>(type: "integer", nullable: false),
                    Utilities = table.Column<int>(type: "integer", nullable: false),
                    Groceries = table.Column<int>(type: "integer", nullable: false),
                    Transportation = table.Column<int>(type: "integer", nullable: false),
                    Entertainment = table.Column<int>(type: "integer", nullable: false),
                    Insurance = table.Column<int>(type: "integer", nullable: false),
                    Loans = table.Column<int>(type: "integer", nullable: false),
                    Savings = table.Column<int>(type: "integer", nullable: false),
                    Other = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Budget", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Budget");
        }
    }
}
