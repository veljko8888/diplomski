using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TestCoreAPI.ApplicationConstants
{
    public static class AppConstants
    {
        #region Constants

        public const string FailedToAddWord = "Greška prilikom dodavanja reči";

        public const string FailedValidWordCheck = "Greška prilikom provere reči";

        public const string WordDoesNotExist = "Reč ne postoji";

        public const string FailedToAddDailyGame = "Greška prilikom dodavanja igara dana";

        public const string FailedToRetrieveDailyGames = "Greška prilikom pretrage igre dana za odabrani datum";

        public const string FailedToAddConnGame = "Greška prilikom dodavanja igre spojnica";

        public const string FailedToAddAssocGame = "Greška prilikom dodavanja igre asocijacije";

        public const string FailedToAddWordExist = "Reč već postoji";

        public const string InvalidDate = "Datum nije validan - odaberite datum u buducnosti.";

        public const string GetLexiconsFailed = "Failed to retrieve lexicons";

        public const string GetUsersFailed = "Greška prilikom dohvatanja korisnika";

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

        public const string NoDailyGame = "Dnevna Igra još nije definisana!";

        public const string ErrorChangingPass = "Došlo je do greške prilikom promene lozinke. Pokušajte ponovo.";

        public const string ConfirmationEmailFailedToSend = "Failed to send user registration confirmation email.";

        public const string PleaseActivateAccount = "Vaš nalog još uvek nije aktiviran. Molimo vas da sačekate.";
        #endregion
    }
}
