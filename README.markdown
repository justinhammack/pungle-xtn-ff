# Steps
1. Create unarchived XPI Folder w/Correct VER
2. Update install.rdf w/Version
3. Add public key via McCoy to install.rdf
4. ZIP **CONTENTS** of folder and renamed to XPI
5. Name appropriately and move XPI to root folder
6. Update RAWupdateFF.rdf file with new list item
7. Double check all path names, version
8. Copy RAWupdateFF.rdf to updateFF.rdf on server
9. McCoy sign the new updateFF.rdf file
10. Copy new versioned XPI to appropriate folder
11. Push all changes, test update
12. Update file path on pungle.me