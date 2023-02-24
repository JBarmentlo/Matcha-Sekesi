- je peux m'auto-bloquer et liker
- quand je me bloque sur la page de recherche, je n'apparais pas bloquee sur la page de profil
- je peux me parler dans le chat
- user dont l'email n'est pas verif apparait dans les resultats de recherches
- Images qui ne se suppriment pas!!!!!!
- User connected n'apparait plus


INSERT into USERS (
    username,
    firstName,
    lastName,
    bio,
    mail,
    password,
    gender,
    sekesualOri,
    zipCode,
    city,
    longitude,
    latitude,
    id,
    image1,
    image2,
    image3,
    image0,
    profilePic,
    gif,
    DOB,
    last_connected)
values (
    'ticklishlion224',
    'Emmy',
    'Lefevre',
    'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
    similique sunt in culpa qui officia',
    'emmy.lefevre@example.com',
    '$2a$08$r.6PAISQbWN1Hb90bR3ej..s9zXv7wSq61OL7n5o.wv4Mio2PYC0C',
    'Female',
    'Gay',
    '21006',
    'Nîmes',
    112.405,
    -75.7352,
    2,
    'https://images.unsplash.com/photo-1580421828423-4b36a8ca65fb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzNzYzNn0?utm_source=dictionnaire&utm_medium=referral',
    'https://randomuser.me/api/portraits/med/women/87.jpg',
    'https://media.giphy.com/media/dK0tjRx03fhlK/giphy.gif',
    '1993-08-07',
    '2022-09-28 11:54:54'
