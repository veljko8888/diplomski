﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.SignalRHub
{
    public interface IHubClient
    {
        Task BroadcastMessage();
    }
}
