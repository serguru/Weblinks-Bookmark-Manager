namespace server.Common;

public enum HistoryEventType
{
    User_registered = 1,
    User_logged_in = 2,
    User_retrieved_the_account = 3,
    User_deleted_the_account = 4,
    User_created_a_page = 5,
    User_deleted_a_page = 6,
    User_forgot_password = 7
};

public enum WeblinksTaskType
{
    Send_register_email = 1,
    Send_forgot_email = 2,
    Send_alive_email = 3
};
