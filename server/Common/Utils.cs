namespace server.Common;

public static class Utils
{

}

public enum HistoryEventType
{
    User_registered = 1,
    User_logged_in = 2,
    User_retrieved_the_account = 3,
    User_deleted_the_account = 4,
    User_created_a_page = 5,
    User_deleted_a_page = 6
};

public enum WeblinksTaskType
{
    Send_reg_email = 1,
    Send_pass_restore_email = 2,
};
