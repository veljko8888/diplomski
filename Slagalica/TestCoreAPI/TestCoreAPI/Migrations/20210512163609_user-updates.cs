using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class userupdates : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TipKorisnika",
                table: "Users",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TipKorisnika",
                table: "Users");
        }
    }
}
