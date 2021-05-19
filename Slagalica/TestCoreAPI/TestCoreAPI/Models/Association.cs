using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class Association
    {
        [Key]
        public Guid Id { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Final { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string A1 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string A2 { get; set; }
        [Column(TypeName = "nvarchar(500)")]
        public string A3 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string A4 { get; set; }
        [Column(TypeName = "nvarchar(500)")]
        public string A { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string B1 { get; set; }
        [Column(TypeName = "nvarchar(500)")]
        public string B2 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string B3 { get; set; }
        [Column(TypeName = "nvarchar(500)")]
        public string B4 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string B { get; set; }
        [Column(TypeName = "nvarchar(500)")]
        public string C1 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string C2 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string C3 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string C4 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string C { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string D1 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string D2 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string D3 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string D4 { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string D { get; set; }
    }
}
