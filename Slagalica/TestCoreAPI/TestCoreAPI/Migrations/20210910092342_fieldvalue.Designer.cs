﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TestCoreAPI.Models;

namespace TestCoreAPI.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20210910092342_fieldvalue")]
    partial class fieldvalue
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("TestCoreAPI.Models.Association", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("A")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("A1")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("A2")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("A3")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("A4")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B1")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B2")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B3")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("B4")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C1")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C2")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C3")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("C4")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D1")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D2")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D3")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("D4")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Final")
                        .HasColumnType("nvarchar(500)");

                    b.HasKey("Id");

                    b.ToTable("Associations");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Connection", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(500)");

                    b.HasKey("Id");

                    b.ToTable("Connections");
                });

            modelBuilder.Entity("TestCoreAPI.Models.DailyGame", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("AssociationId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("ConnectionId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("DailyGameDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("AssociationId");

                    b.HasIndex("ConnectionId");

                    b.ToTable("DailyGames");
                });

            modelBuilder.Entity("TestCoreAPI.Models.DailyGamePlay", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("DailyGameDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Points")
                        .HasColumnType("int");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("DailyGamePlays");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Lexicon", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<double>("SentimentScore")
                        .HasColumnType("float");

                    b.Property<string>("Word")
                        .HasColumnType("nvarchar(150)");

                    b.HasKey("Id");

                    b.ToTable("Lexicons");
                });

            modelBuilder.Entity("TestCoreAPI.Models.MultiplayerGame", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Chars")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Combination")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FieldName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("GameStatus")
                        .HasColumnType("int");

                    b.Property<DateTime>("MultiplayerGameDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Nums")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OnMove")
                        .HasColumnType("int");

                    b.Property<int>("Player1EvalResult")
                        .HasColumnType("int");

                    b.Property<Guid?>("Player1Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Player1Points")
                        .HasColumnType("int");

                    b.Property<bool>("Player1WordsFinished")
                        .HasColumnType("bit");

                    b.Property<int>("Player2EvalResult")
                        .HasColumnType("int");

                    b.Property<Guid?>("Player2Id")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Player2Points")
                        .HasColumnType("int");

                    b.Property<bool>("Player2WordsFinished")
                        .HasColumnType("bit");

                    b.Property<DateTime>("SlagalicaGameEnds")
                        .HasColumnType("datetime2");

                    b.Property<string>("SpojniceText")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SpojniceTextLeft")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid?>("WinnerId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("Player1Id");

                    b.HasIndex("Player2Id");

                    b.HasIndex("WinnerId");

                    b.ToTable("MultiplayerGames");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Pair", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("ConnectionId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Left")
                        .HasColumnType("nvarchar(500)");

                    b.Property<string>("Right")
                        .HasColumnType("nvarchar(500)");

                    b.HasKey("Id");

                    b.HasIndex("ConnectionId");

                    b.ToTable("Pairs");
                });

            modelBuilder.Entity("TestCoreAPI.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("DatumRodjenja")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(150)");

                    b.Property<string>("Ime")
                        .HasColumnType("nvarchar(150)");

                    b.Property<string>("KorisnickoIme")
                        .HasColumnType("nvarchar(150)");

                    b.Property<bool>("NalogAktiviran")
                        .HasColumnType("bit");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("nvarchar(350)");

                    b.Property<string>("PasswordSalt")
                        .HasColumnType("nvarchar(350)");

                    b.Property<string>("Pol")
                        .HasColumnType("nvarchar(1)");

                    b.Property<string>("Prezime")
                        .HasColumnType("nvarchar(150)");

                    b.Property<string>("ProfilnaSlika")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TipKorisnika")
                        .HasColumnType("int");

                    b.Property<string>("Zanimanje")
                        .HasColumnType("nvarchar(150)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TestCoreAPI.Models.UserRegistrationConfirmation", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("nvarchar(150)");

                    b.Property<DateTime>("TokenExpirationTime")
                        .HasColumnType("datetime2");

                    b.HasKey("UserId");

                    b.ToTable("UserRegistrationConfirmations");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Word", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Rec")
                        .HasColumnType("nvarchar(150)");

                    b.HasKey("Id");

                    b.ToTable("Words");
                });

            modelBuilder.Entity("TestCoreAPI.Models.DailyGame", b =>
                {
                    b.HasOne("TestCoreAPI.Models.Association", "Association")
                        .WithMany()
                        .HasForeignKey("AssociationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TestCoreAPI.Models.Connection", "Connection")
                        .WithMany()
                        .HasForeignKey("ConnectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TestCoreAPI.Models.DailyGamePlay", b =>
                {
                    b.HasOne("TestCoreAPI.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TestCoreAPI.Models.MultiplayerGame", b =>
                {
                    b.HasOne("TestCoreAPI.Models.User", "Player1")
                        .WithMany()
                        .HasForeignKey("Player1Id");

                    b.HasOne("TestCoreAPI.Models.User", "Player2")
                        .WithMany()
                        .HasForeignKey("Player2Id");

                    b.HasOne("TestCoreAPI.Models.User", "Winner")
                        .WithMany()
                        .HasForeignKey("WinnerId");
                });

            modelBuilder.Entity("TestCoreAPI.Models.Pair", b =>
                {
                    b.HasOne("TestCoreAPI.Models.Connection", "Connection")
                        .WithMany("Pairs")
                        .HasForeignKey("ConnectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("TestCoreAPI.Models.UserRegistrationConfirmation", b =>
                {
                    b.HasOne("TestCoreAPI.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
