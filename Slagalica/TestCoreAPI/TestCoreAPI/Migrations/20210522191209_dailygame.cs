using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace TestCoreAPI.Migrations
{
    public partial class dailygame : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DailyGames",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    DatumRodjenja = table.Column<DateTime>(nullable: false),
                    ConnectionId = table.Column<Guid>(nullable: false),
                    AssociationId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyGames", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyGames_Associations_AssociationId",
                        column: x => x.AssociationId,
                        principalTable: "Associations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DailyGames_Connections_ConnectionId",
                        column: x => x.ConnectionId,
                        principalTable: "Connections",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyGames_AssociationId",
                table: "DailyGames",
                column: "AssociationId");

            migrationBuilder.CreateIndex(
                name: "IX_DailyGames_ConnectionId",
                table: "DailyGames",
                column: "ConnectionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyGames");
        }
    }
}
