using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static TestCoreAPI.Dtos.Enums;

namespace TestCoreAPI.Models
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string KorisnickoIme { get; set; }
        public string Email { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Zanimanje { get; set; }
        public string Pol { get; set; }
        public bool NalogAktiviran { get; set; }
        public string Sifra { get; set; }
        public byte[] ProfilnaSlika { get; set; }
        public DateTime DatumRodjenja { get; set; }
        public TipKorisnika TipKorisnika { get; set; }
    }
}
