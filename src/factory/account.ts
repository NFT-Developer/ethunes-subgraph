import { Account } from "../../generated/schema"

export function loadOrCreateAccount(
  accountId: string
): Account {

  let account = Account.load(accountId)

  if (account == null) {
    account = new Account(accountId)
  }
  
  return account as Account
}
