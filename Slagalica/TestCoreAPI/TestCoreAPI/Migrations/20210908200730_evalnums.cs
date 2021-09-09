using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class evalnums : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Player1EvalResult",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Player2EvalResult",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Player1EvalResult",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player2EvalResult",
                table: "MultiplayerGames");
        }
    }
}
