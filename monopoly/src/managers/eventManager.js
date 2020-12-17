/*
Event arrayi alacak
her event etkiledigi tile ve playerlari tutacak, kim yarattiysa onu tutacak fonksiyonunu tutacak
event ekleme silme olacak
event bulma olacak tileid yada user vererek
Mesela:
0.tile, all users, add 200 money -> baslangic eventi

Murat bought 8.tile then create an Event
8.tile all users except Murat, add 50 money to murat, remove 50 money from effected user.


GameManager sunu yapabilmeli
->  EventManager.getEvents(currentUser, currentUser.tileId) -> [Event..]

 */