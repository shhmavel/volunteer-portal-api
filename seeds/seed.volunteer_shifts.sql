INSERT INTO races (name)
VALUES
('Colorado Crossing'),
('Habanero 100'),
('Alamo City Ultra'),
('Mission Tejas'),
('El Taco Loco');

INSERT INTO shifts (name, race_name, date, day, time, race_id)
VALUES
('Main Aid Station', 'Habanero 100', '8/17/19', 'Saturday', '5am-2pm', 2),
('Merch', 'Habanero 100', '8/17/19', 'Saturday', '5am-2pm', 2),
('Merch', 'Habanero 100', '8/18/19', 'Sunday', '12am-9am', 2),
('Main Aid Station', 'Habanero 100', '8/18/19', 'Sunday', '12am-9am', 2),
('RD Assistant', 'Colorado Crossing', '9/14/19', 'Saturday', '5am-2pm',1),
('Second Aid Station', 'Colorado Crossing', '9/14/19', 'Saturday', '5am-2pm',1),
('Merch', 'Colorado Crossing', '9/15/19', 'Sunday', '12am-9am',1),
('Medals', 'Colorado Crossing', '9/15/19', 'Sunday', '12am-9am',1),
('Packet Pickup', 'Alamo City Ultra', '9/01/19', 'Saturday', '5am-2pm',3),
('Packet Pickup', 'Alamo City Ultra', '9/01/19', 'Saturday', '5am-2pm',3),
('Merch', 'Alamo City Ultra', '9/02/19', 'Sunday', '12am-9am',3),
('Merch', 'Alamo City Ultra', '9/02/19', 'Sunday', '12am-9am',3),
('RD Assistant', 'Mission Tejas', '9/28/19', 'Saturday', '5am-2pm',4),
('Merch', 'Mission Tejas', '9/28/19', 'Saturday', '5am-2pm',4),
('Second Aid Station', 'Mission Tejas', '9/29/19', 'Sunday', '12am-9am',4),
('RD Assistant', 'Mission Tejas', '9/29/19', 'Sunday', '12am-9am',4),
('Main Aid Station', 'El Taco Loco', '10/26/19', 'Saturday', '5am-2pm',5),
('Merch', 'El Taco Loco', '10/26/19', 'Saturday', '5am-2pm',5),
('RD Assistant', 'El Taco Loco', '10/26/19', 'Saturday', '2pm-9pm',5),
('Second Aid Station', 'El Taco Loco', '10/26/19', 'Saturday', '2pm-9pm',5);