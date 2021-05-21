using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using static TestCoreAPI.Dtos.Enums;

namespace TestCoreAPI.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string Ime { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string Prezime { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string Email { get; set; }
        [Column(TypeName = "nvarchar(150)")]
        public string Zanimanje { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string KorisnickoIme { get; set; }

        [Column(TypeName = "nvarchar(1)")]
        public string Pol { get; set; }

        public DateTime DatumRodjenja { get; set; }

        [Column(TypeName = "nvarchar(350)")]
        public byte[] PasswordHash { get; set; }

        [Column(TypeName = "nvarchar(350)")]
        public byte[] PasswordSalt { get; set; }

        public string ProfilnaSlika { get; set; }

        public bool NalogAktiviran { get; set; }
        public TipKorisnika TipKorisnika { get; set; }
    }
}
