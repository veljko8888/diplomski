using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class multiplayergame1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MultiplayerGames",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    MultiplayerGameDate = table.Column<DateTime>(nullable: false),
                    Player1Points = table.Column<int>(nullable: false),
                    Player2Points = table.Column<int>(nullable: false),
                    Player1Id = table.Column<Guid>(nullable: true),
                    Player2Id = table.Column<Guid>(nullable: true),
                    WinnerId = table.Column<Guid>(nullable: true),
                    GameStatus = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MultiplayerGames", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MultiplayerGames_Users_Player1Id",
                        column: x => x.Player1Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MultiplayerGames_Users_Player2Id",
                        column: x => x.Player2Id,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MultiplayerGames_Users_WinnerId",
                        column: x => x.WinnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MultiplayerGames_Player1Id",
                table: "MultiplayerGames",
                column: "Player1Id");

            migrationBuilder.CreateIndex(
                name: "IX_MultiplayerGames_Player2Id",
                table: "MultiplayerGames",
                column: "Player2Id");

            migrationBuilder.CreateIndex(
                name: "IX_MultiplayerGames_WinnerId",
                table: "MultiplayerGames",
                column: "WinnerId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MultiplayerGames");
        }
    }
}
