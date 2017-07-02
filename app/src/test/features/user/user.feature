Feature: User management

    Scenario: Retrieve administrator user
        When I search user 'user-1'
        Then the user is found
        And his last name is 'Administrator'
