﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.Dtos
{
    public class UpdateGameEndsAndNotifyCombinationsDto
    {
        public MultiplayerGameDto MultiplayerGameDto { get; set; }
        public Guid UserId { get; set; }
    }
}
