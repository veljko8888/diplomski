using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class LexiconDto
    {
        public Guid? Id { get; set; }

        public string? Word { get; set; }

        public double? SentimentScore { get; set; }
    }
}
