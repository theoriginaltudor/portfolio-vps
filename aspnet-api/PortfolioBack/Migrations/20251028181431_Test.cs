using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PortfolioBack.Migrations
{
    /// <inheritdoc />
    public partial class Test : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PasswordIterations",
                table: "Users",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldDefaultValue: 100000);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "PasswordIterations",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 100000,
                oldClrType: typeof(int),
                oldType: "integer");
        }
    }
}
