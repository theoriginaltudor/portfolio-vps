using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PortfolioBack.Migrations
{
    /// <inheritdoc />
    public partial class AddUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProjectAssets_Projects_ProjectId1",
                table: "ProjectAssets");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectSkills_Projects_ProjectId1",
                table: "ProjectSkills");

            migrationBuilder.DropForeignKey(
                name: "FK_ProjectSkills_Skills_SkillId1",
                table: "ProjectSkills");

            migrationBuilder.DropIndex(
                name: "IX_ProjectSkills_ProjectId1",
                table: "ProjectSkills");

            migrationBuilder.DropIndex(
                name: "IX_ProjectSkills_SkillId1",
                table: "ProjectSkills");

            migrationBuilder.DropIndex(
                name: "IX_ProjectAssets_ProjectId1",
                table: "ProjectAssets");

            migrationBuilder.DropColumn(
                name: "ProjectId1",
                table: "ProjectSkills");

            migrationBuilder.DropColumn(
                name: "SkillId1",
                table: "ProjectSkills");

            migrationBuilder.DropColumn(
                name: "ProjectId1",
                table: "ProjectAssets");

            migrationBuilder.AlterColumn<string>(
                name: "LongDescription",
                table: "Projects",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "bytea", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "bytea", nullable: false),
                    PasswordIterations = table.Column<int>(type: "integer", nullable: false, defaultValue: 100000),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.AddColumn<int>(
                name: "ProjectId1",
                table: "ProjectSkills",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SkillId1",
                table: "ProjectSkills",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "LongDescription",
                table: "Projects",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "ProjectId1",
                table: "ProjectAssets",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSkills_ProjectId1",
                table: "ProjectSkills",
                column: "ProjectId1");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectSkills_SkillId1",
                table: "ProjectSkills",
                column: "SkillId1");

            migrationBuilder.CreateIndex(
                name: "IX_ProjectAssets_ProjectId1",
                table: "ProjectAssets",
                column: "ProjectId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectAssets_Projects_ProjectId1",
                table: "ProjectAssets",
                column: "ProjectId1",
                principalTable: "Projects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectSkills_Projects_ProjectId1",
                table: "ProjectSkills",
                column: "ProjectId1",
                principalTable: "Projects",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProjectSkills_Skills_SkillId1",
                table: "ProjectSkills",
                column: "SkillId1",
                principalTable: "Skills",
                principalColumn: "Id");
        }
    }
}
