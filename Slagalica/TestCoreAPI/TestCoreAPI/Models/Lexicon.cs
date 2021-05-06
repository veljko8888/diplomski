using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Models
{
    public class Lexicon
    {
        [Key]
        public Guid Id { get; set; }

        [Column(TypeName = "nvarchar(150)")]
        public string Word { get; set; }

        public double SentimentScore { get; set; }
    }
}
