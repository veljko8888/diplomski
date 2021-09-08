using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class wordsfinished : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Player1WordsFinished",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Player2WordsFinished",
                table: "MultiplayerGames",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Player1WordsFinished",
                table: "MultiplayerGames");

            migrationBuilder.DropColumn(
                name: "Player2WordsFinished",
                table: "MultiplayerGames");
        }
    }
}
