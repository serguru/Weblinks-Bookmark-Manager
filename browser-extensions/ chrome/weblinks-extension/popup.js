//let siteUrl = "https://api.weblinks.click/api/";
let siteUrl = "https://localhost:7215/api/";

let $loginForm;
let $loginInput;
let $passwordInput;
let $addLinkForm;
let $loginError;
let $addLinkMessage;
let $generalMessageDiv;
let $pageSelect;
let $columnSelect;
let $linkNameInput;
let $linkAddressInput;
let account;
let pages;
let page;
let rows;
let row;
let columns;
let column;

function resetAll() {
    account = undefined;
    pages = undefined;
    page = undefined;
    rows = undefined;
    row = undefined;
    columns = undefined;
    column = undefined;
}

function showGeneralMessage(message, error) {
    $loginForm.hide();
    $addLinkForm.hide();
    $generalMessageDiv.show();

    if (error) {
        $generalMessageDiv.css("color", "red");
    } else {
        $generalMessageDiv.css("color", "");
    }

    $generalMessageDiv.html(message);
}

function showLoginError(message) {
    $loginError.html(message);
    $loginError.show();
    setTimeout(function () {
        $loginError.html("");
    }, 5000);
}

function showAddLinkMessage(message, error) {
    $addLinkMessage.html(message);
    if (error) {
        $addLinkMessage.css("color", "red");
    } else {
        $addLinkMessage.css("color", "");
    }
    $addLinkMessage.show();
    setTimeout(function () {
        $addLinkMessage.html("");
    }, 5000);

}

function showLoading() {
    $loginForm.hide();
    $addLinkForm.hide();
    $generalMessageDiv.show();
    $generalMessageDiv.css("color", "");
    $generalMessageDiv.html("Loading...");
}

function showLoginForm() {
    $generalMessageDiv.hide();
    $addLinkForm.hide();
    $loginError.hide();
    $loginForm.show();
}

function showAddLinkForm() {
    pages = account.pages;

    $loginForm.hide();
    $generalMessageDiv.hide();
    populatePagesSelect();

    chrome.tabs.query({ active: true }, function (tab) {
        if (tab.length === 0) {
            return;
        }
        $linkNameInput.val(tab[0].title);
        $linkAddressInput.val(tab[0].url);
    });

    $addLinkForm.show();
}

function onPagesSelectChange() {


    chrome.tabs.query({ active: true }, function (tab) {
        if (tab.length === 0) {
            return;
        }

        const a = tab;
    });


    rows = undefined;
    row = undefined;
    columns = undefined;
    column = undefined;
    $rowSelect.find("option").remove();
    $columnSelect.find("option").remove();
    if (!pages || pages.length === 0) {
        showGeneralMessage("Pages not found or empty", true);
        return;
    }
    page = pages.find(x => x.id === +$pageSelect[0].value);
    if (!page) {
        showGeneralMessage("Page not found", true);
        return;
    }
    localStorage.setItem("savedPageId", page.id);
    if (!page.lrows || page.lrows.length === 0) {
        return;
    }
    rows = page.lrows;
    const savedRowId = localStorage.getItem("savedRowId");
    rows.forEach(function (x) {
        let option = new Option(x.caption || "No name row", x.id);
        option.selected = x.id === savedRowId;
        $rowSelect.append($(option));
    });
    onRowsSelectChange();
}

function onRowsSelectChange() {
    columns = undefined;
    column = undefined;
    $columnSelect.find("option").remove();
    if (!rows || rows.length === 0) {
        return;
    }
    row = rows.find(x => x.id === +$rowSelect[0].value)
    if (!row) {
        showGeneralMessage("Row not found", true);
        return;
    }
    localStorage.setItem("savedRowId", row.id);
    if (!row.lcolumns || row.lcolumns.length === 0) {
        return;
    }
    columns = row.lcolumns;
    const savedColumnId = localStorage.getItem("savedColumnId");

    columns.forEach(function (x) {
        let option = new Option(x.caption || "No name column", x.id);
        option.selected = x.id === savedColumnId;
        $columnSelect.append($(option));
    });
    onColumnsSelectChange();
}

function onColumnsSelectChange() {
    column = undefined;
    if (!columns || columns.length === 0) {
        return;
    }
    column = columns.find(x => x.id === +$columnSelect[0].value)
    if (!column) {
        showGeneralMessage("Column not found", true);
        return;
    }
    localStorage.setItem("savedColumnId", column.id);
}


function populatePagesSelect() {
    const savedPageId = localStorage.getItem("savedPageId");
    pages.forEach(function (x) {
        const option = new Option(x.caption || x.pagePath, x.id);
        option.selected = x.id === +savedPageId;
        $pageSelect.append($(option));
    });

    onPagesSelectChange();
}

function ajaxSetupToken() {
    $.ajaxSetup({
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
}

function getMyPages() {

    debugger;

    if (!isLoggedIn()) {
        showLoginForm();
        return;
    }

    ajaxSetupToken();

    resetAll();

    $.get(siteUrl + "pages/having-columns")
        .done(function (response) {

            if (response.pages.length === 0) {
                showGeneralMessage("You have no pages to add a link to", true);
                return;
            }

            account = response;
            showAddLinkForm();
        })
        .fail(function (response) {
            if (response.status === 401) {
                localStorage.removeItem("token");
                showLoginForm();
                showLoginError("Wrong login email or password");
                return;
            }
            showGeneralMessage('Error. Failed retrieving pages list.', true);
        })
        .always(function () {

        });
}

function login() {
    const email = $loginInput[0].value;
    const password = $passwordInput[0].value;

    if (!email || !password) {
        showLoginError("Email and Password are both required");
        return;
    }

    const loginModel = {
        UserEmail: email,
        UserPassword: password
    }

    $.post(siteUrl + "account/login", JSON.stringify(loginModel))
        .done(function (response) {
            localStorage.setItem("token", response.token);
            getMyPages();
        })
        .fail(function (response) {
            if (response.status !== 401) {
                return;
            }
            localStorage.removeItem("token");
            showLoginForm();
            showLoginError("Wrong login email or password");
        });
}

function addLink() {

    if (!isLoggedIn()) {
        showLoginForm();
        return;
    }

    ajaxSetupToken();

    if (!column?.links) {
        showAddLinkMessage('No column or column links to add a link to', true);
        return;
    }

    let linkLabel = $linkNameInput[0].value;
    let linkAddress = $linkAddressInput[0].value;

    if (!linkLabel || !linkAddress) {
        showAddLinkMessage("Link Label and Link Address are both required", true);
        return;
    }

    if (linkLabel.length > 50) {
        showAddLinkMessage("Link Label cannot be longer than 50 characters", true);
        return;
    }

    const linkModel = {
        Id: 0,
        ColumnId: column.id,
        AUrl: linkAddress,
        Caption: linkLabel
    }

    $.ajax({
        url: siteUrl + "pages/add-update-link",
        type: 'POST',
        data: JSON.stringify(linkModel),
        success: function () {
            showGeneralMessage("Link has been added");

            setTimeout(function () {
                window.close();
            }, 2000);
        },
        error: function (error) {
            showAddLinkMessage('Error. Failed adding a link.', true);
        }
    });
}

const isLoggedIn = () => {
    const item = localStorage.getItem("token");
    return !!item;
}

$(document).ready(function () {

    $.ajaxSetup({
        contentType: "application/json",
    });

    $generalMessageDiv = $("#generalMessageDiv");
    $loginForm = $("#loginForm");
    $loginInput = $("#loginInput");
    $passwordInput = $("#passwordInput");
    $addLinkForm = $("#addLinkForm");
    $linkNameInput = $("#linkNameInput");
    $linkAddressInput = $("#linkAddressInput");
    $loginError = $("#loginError");
    $addLinkMessage = $("#addLinkMessage");
    $pageSelect = $("#pageSelect");
    $columnSelect = $("#columnSelect");
    $rowSelect = $("#rowSelect");

    $pageSelect.on("change", function (e) {
        onPagesSelectChange();
    });

    $rowSelect.on("change", function (e) {
        onRowsSelectChange();
    });

    $columnSelect.on("change", function (e) {
        onColumnsSelectChange();
    });

    $("#loginBtn").on("click", function () {
        login();
    });

    $("#addLinkBtn").on("click", function () {
        addLink();
    });

    getMyPages();
})
