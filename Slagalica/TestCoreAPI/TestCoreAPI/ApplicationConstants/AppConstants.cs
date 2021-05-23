using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.ApplicationConstants
{
    public static class AppConstants
    {
        #region Constants

        public const string FailedToUpdateLexicon = "Failed to update lexicon";

        public const string FailedToAddLexicon = "Failed to add lexicon";

        public const string FailedToAddWord = "Greška prilikom dodavanja reči";

        public const string FailedToAddDailyGame = "Greška prilikom dodavanja igara dana";

        public const string FailedToRetrieveDailyGames = "Greška prilikom pretrage igre dana za odabrani datum";

        public const string FailedToAddConnGame = "Greška prilikom dodavanja igre spojnica";

        public const string FailedToAddAssocGame = "Greška prilikom dodavanja igre asocijacije";

        public const string FailedToAddWordExist = "Reč već postoji";

        public const string InvalidDate = "Datum nije validan - odaberite datum u buducnosti.";

        public const string GetLexiconsFailed = "Failed to retrieve lexicons";

        public const string GetUsersFailed = "Greška prilikom dohvatanja korisnika";

        public const string FailedToDeleteLexicon = "Failed to delete lexicon";

        public const string ConfirmRegistration = "Confirm Registration";

        public const string NoUsersInDB = "There are no users in the system";

        public const string RanksError = "Greška prilikom dohvatanja rank liste";

        public const string NoSuchUser = "User does not exist";

        public const string ErrorSavingUser = "Error encountered while registering user";

        public const string ErrorUpdatingUser = "Error updating user";

        public const string WrongUsernameOrPassword = "Pogrešan email ili lozinka.";

        public const string TokenExpired = "User Confirmation token Expired. We are sending new confirmation link. Check your email again.";

        public const string ErrorConfirmingRegistration = "An Error occured while trying to confirm user registration.";

        public const string NoUserTokenMatch = "There is no corresponding user-token match for confirmation.";

        public const string UsernameAlreadyExist = "Korisnicko ime ili Email već postoje";

        public const string ImageSizeTooBig = "Veličina profilne slike može biti maksimalno 300x300 px";
        
        public const string UserDoesNotExist = "Korisnik sa ovim Email-om ne postoji";

        public const string WrongOldPassword = "Stara lozinka je pogrešna!";

        public const string ErrorChangingPass = "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo.";

        public const string ConfirmationEmailFailedToSend = "Failed to send user registration confirmation email.";

        public const string PleaseActivateAccount = "Vaš nalog još uvek nije aktiviran. Molimo vas da sačekate.";
        #endregion

        #region StaticStrings

        public static string DefaultValuesDB = @"INSERT INTO dbo.Lexicons(Id, Word, SentimentScore)
VALUES ('5e7f0d20-7285-4655-9f2a-02bddd1ce39f', 'nice', 0.4);
INSERT INTO dbo.Lexicons(Id, Word, SentimentScore)
VALUES ('af79a270-d3e8-4343-b94c-32a000ab81a7', 'excellent', 0.8);
INSERT INTO dbo.Lexicons(Id, Word, SentimentScore)
VALUES ('9644e7fd-f88e-444f-bff4-a0ef0aa22e99', 'modest', 0);
INSERT INTO dbo.Lexicons(Id, Word, SentimentScore)
VALUES ('3212f5a2-c2e5-48a7-8fac-c1a72e7e35c5', 'horrible', -0.8);
INSERT INTO dbo.Lexicons(Id, Word, SentimentScore)
VALUES ('f2462e07-0f82-487e-8124-a0f22565cebf', 'ugly', -0.5);";

        public static string UserRegistrationConfirmURL = "http://localhost:4200/confirmation/USERID/TOKEN";

        public static string EmailTemplate = @"<!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Strict//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd""><html data-editor-version=""2"" class=""sg-campaigns"" xmlns=""http://www.w3.org/1999/xhtml""><head>
      <meta http-equiv=""Content-Type"" content=""text/html; charset=utf-8"">
      <meta name=""viewport"" content=""width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"">
      <!--[if !mso]><!-->
      <meta http-equiv=""X-UA-Compatible"" content=""IE=Edge"">
      <style type=""text/css"">
    body, p, div {
      font-family: inherit;
      font-size: 14px;
    }
    body {
      color: #000000;
    }
    body a {
      color: #000000;
      text-decoration: none;
    }
    p { margin: 0; padding: 0; }
    table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img.max-width {
      max-width: 100% !important;
    }
    .column.of-2 {
      width: 50%;
    }
    .column.of-3 {
      width: 33.333%;
    }
    .column.of-4 {
      width: 25%;
    }
    @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }
      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .columns {
        width: 100% !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }
  </style>
      <!--user entered Head Start--><link href=""https://fonts.googleapis.com/css?family=Viga&display=swap"" rel=""stylesheet""><style>
    body {font-family: 'Viga', sans-serif;}
</style><!--End Head user entered-->
    </head>
    <body>
      <center class=""wrapper"" data-link-color=""#000000"" data-body-style=""font-size:14px; font-family:inherit; color:#000000; background-color:#FFFFFF;"">
        <div class=""webkit"">
          <table cellpadding=""0"" cellspacing=""0"" border=""0"" width=""100%"" class=""wrapper"" bgcolor=""#FFFFFF"">
            <tbody><tr>
              <td valign=""top"" bgcolor=""#FFFFFF"" width=""100%"">
                <table width=""100%"" role=""content-container"" class=""outer"" align=""center"" cellpadding=""0"" cellspacing=""0"" border=""0"">
                  <tbody><tr>
                    <td width=""100%"">
                      <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"">
                        <tbody><tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width=""600"">
  <![endif]-->
                                    <table width=""100%"" cellpadding=""0"" cellspacing=""0"" border=""0"" style=""width:100%; max-width:600px;"" align=""center"">
                                      <tbody><tr>
                                        <td role=""modules-container"" style=""padding:0px 0px 0px 0px; color:#000000; text-align:left;"" bgcolor=""#FFFFFF"" width=""100%"" align=""left""><table class=""module preheader preheader-hide"" role=""module"" data-type=""preheader"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;"">
    <tbody><tr>
      <td role=""module-content"">
        <p></p>
      </td>
    </tr>
  </tbody></table><table class=""module"" role=""module"" data-type=""text"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""table-layout: fixed;"" data-muid=""bff8ffa1-41a9-4aab-a2ea-52ac3767c6f4"">
    <tbody>
      <tr>
        <td style=""padding:18px 30px 18px 30px; line-height:40px; text-align:inherit; background-color:#dde6de;"" height=""100%"" valign=""top"" bgcolor=""#dde6de"" role=""module-content""><div><div style=""font-family: inherit; text-align: center""><span style=""color: #6fab81; font-size: 40px; font-family: inherit"">Thank you for registration!</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table class=""module"" role=""module"" data-type=""text"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""table-layout: fixed;"" data-muid=""2f94ef24-a0d9-4e6f-be94-d2d1257946b0"">
    <tbody>
      <tr>
        <td style=""padding:18px 50px 18px 50px; line-height:22px; text-align:inherit; background-color:#dde6de;"" height=""100%"" valign=""top"" bgcolor=""#dde6de"" role=""module-content""><div><div style=""font-family: inherit; text-align: center""><span style=""font-size: 16px; font-family: inherit"">Confirm your email address and start organizing your visits.&nbsp;</span></div><div></div></div></td>
      </tr>
    </tbody>
  </table><table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""module"" data-role=""module-button"" data-type=""button"" role=""module"" style=""table-layout:fixed;"" width=""100%"" data-muid=""c7bd4768-c1ab-4c64-ba24-75a9fd6daed8"">
      <tbody>
        <tr>
          <td align=""center"" bgcolor=""#dde6de"" class=""outer-td"" style=""padding:10px 0px 20px 0px;"">
            <table border=""0"" cellpadding=""0"" cellspacing=""0"" class=""wrapper-mobile"" style=""text-align:center;"">
              <tbody>
                <tr>
                <td align=""center"" bgcolor=""#eac96c"" class=""inner-td"" style=""border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"">
                  <a href=""CONFIRMURL"" style=""background-color:#eac96c; border:0px solid #333333; border-color:#333333; border-radius:0px; border-width:0px; color:#000000; display:inline-block; font-size:16px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:20px 30px 20px 30px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;"" target=""_blank"">CONFIRMBUTTON</a>
                </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table><table border=""0"" cellpadding=""0"" cellspacing=""0"" align=""center"" width=""100%"" role=""module"" data-type=""columns"" style=""padding:40px 30px 30px 30px;"" bgcolor=""#dde6de"">
    <tbody>
      <tr role=""module-content"">
        <td height=""100%"" valign=""top"">
          <table class=""column"" width=""166"" style=""width:166px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 0px;"" cellpadding=""0"" cellspacing=""0"" align=""left"" border=""0"" bgcolor="""">
            <tbody>
              <tr>
                <td style=""padding:0px;margin:0px;border-spacing:0;""><table class=""wrapper"" role=""module"" data-type=""image"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""table-layout: fixed;"" data-muid=""35f4b6e7-fc49-4a6f-a23c-e84ad33abca4"">
    <tbody>
      <tr>
        <td style=""font-size:6px; line-height:10px; padding:0px 0px 0px 0px;"" valign=""top"" align=""center"">
          <img class=""max-width"" border=""0"" style=""display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;"" width=""80"" alt="""" data-proportionally-constrained=""true"" data-responsive=""false"" src=""http://cdn.mcauto-images-production.sendgrid.net/954c252fedab403f/0394b217-16c4-49ae-b696-561adcd513aa/119x119.png"" height=""80"">
        </td>
      </tr>
    </tbody>
  </table><table class=""module"" role=""module"" data-type=""text"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""table-layout: fixed;"" data-muid=""4f3e6dad-4d49-49b4-b842-97c93e43616f"">
    <tbody>
      <tr>
        <td style=""padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;"" height=""100%"" valign=""top"" bgcolor="""" role=""module-content""><div><div style=""font-family: inherit; text-align: inherit""><span style=""font-size: 14px"">Keep track of your doctor visits Your medical card in one place!&nbsp;</span></div>
<div style=""font-family: inherit; text-align: inherit""><br></div>
<div></div></div></td>
      </tr>
    </tbody>
  </table></td>
              </tr>
            </tbody>
          </table>
          <table class=""column"" width=""166"" style=""width:166px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 10px;"" cellpadding=""0"" cellspacing=""0"" align=""left"" border=""0"" bgcolor="""">
            <tbody>
              <tr>
                <td style=""padding:0px;margin:0px;border-spacing:0;""><table class=""wrapper"" role=""module"" data-type=""image"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""table-layout: fixed;"" data-muid=""0cb2f52e-e1c0-4b42-a114-04aa36fe57f5"">
    <tbody>
      <tr>
        <td style=""font-size:6px; line-height:10px; padding:0px 0px 0px 0px;"" valign=""top"" align=""center"">
          <img class=""max-width"" border=""0"" style=""display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;"" width=""80"" alt="""" data-proportionally-constrained=""true"" data-responsive=""false"" src=""http://cdn.mcauto-images-production.sendgrid.net/954c252fedab403f/461a0641-b2b7-459c-ab49-ea560fc221f7/119x119.png"" height=""80"">
        </td>
      </tr>
    </tbody>
  </table><table class=""module"" role=""module"" data-type=""text"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""table-layout: fixed;"" data-muid=""9bf90608-97e0-467e-a709-f45d87b0451b"">
    <tbody>
      <tr>
        <td style=""padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;"" height=""100%"" valign=""top"" bgcolor="""" role=""module-content""><div><div style=""font-family: inherit; text-align: inherit""><span style=""font-size: 14px"">Organize your time, make a free reservation online for your medical examination or intervention.</span></div>
<div style=""font-family: inherit; text-align: inherit""><br></div>
<div></div></div></td>
      </tr>
    </tbody>
  </table></td>
              </tr>
            </tbody>
          </table>
        <table width=""166"" style=""width:166px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 10px;"" cellpadding=""0"" cellspacing=""0"" align=""left"" border=""0"" bgcolor="""" class=""column column-2"">
      <tbody>
        <tr>
          <td style=""padding:0px;margin:0px;border-spacing:0;""><table class=""wrapper"" role=""module"" data-type=""image"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""table-layout: fixed;"" data-muid=""231c1abd-75e6-4f22-a697-c5f3819b2b07"">
    <tbody>
      <tr>
        <td style=""font-size:6px; line-height:10px; padding:0px 0px 0px 0px;"" valign=""top"" align=""center"">
          <img class=""max-width"" border=""0"" style=""display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px;"" width=""80"" alt="""" data-proportionally-constrained=""true"" data-responsive=""false"" src=""http://cdn.mcauto-images-production.sendgrid.net/954c252fedab403f/61f17ba7-b7af-4276-8e61-2501e525e4c3/119x119.png"" height=""80"">
        </td>
      </tr>
    </tbody>
  </table><table class=""module"" role=""module"" data-type=""text"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""table-layout: fixed;"" data-muid=""e82d5e62-b94c-42bb-a289-4515ec9ecc85"">
    <tbody>
      <tr>
        <td style=""padding:18px 0px 18px 0px; line-height:22px; text-align:inherit;"" height=""100%"" valign=""top"" bgcolor="""" role=""module-content""><div><div style=""font-family: inherit; text-align: inherit""><span style=""font-size: 14px"">Easy communicate with your doctor and have all informations in one place!</span></div>
<div style=""font-family: inherit; text-align: inherit""><br></div>
<div></div></div></td>
      </tr>
    </tbody>
  </table></td>
        </tr>
      </tbody>
    </table></td>
      </tr>
    </tbody>
  </table><table class=""module"" role=""module"" data-type=""text"" border=""0"" cellpadding=""0"" cellspacing=""0"" width=""100%"" style=""table-layout: fixed;"" data-muid=""30d9a68c-ce13-4754-a845-6c3dc22721ee"">
    <tbody>
      <tr>
        <td style=""padding:40px 40px 40px 40px; line-height:22px; text-align:inherit; background-color:#fe737c;"" height=""100%"" valign=""top"" bgcolor=""#fe737c"" role=""module-content""><div><div style=""font-family: inherit; text-align: center""><span style=""color: #ffffff; font-size: 16px"">Need more help figuring things out? Contact us whenever!</span></div>
<div style=""font-family: inherit; text-align: center""><br></div>
<div style=""font-family: inherit; text-align: center""><a href=""http://www.google.com""><span style=""color: #ffffff; font-size: 16px""><u>Help Center</u></span></a></div><div></div></div></td>
      </tr>
    </tbody>
  </table></td>
                                      </tr>
                                    </tbody></table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </div>
      </center>
    
  
</body></html>";
        #endregion
    }
}
