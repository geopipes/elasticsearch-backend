0.0.12
  - switching type from memory (default) to 'indexed' on bbox queries

0.0.11
  - sorting on _score by default
  - sorting on _score and geo_distance for geo_distance queries
  
0.0.10
  - making centroid optional for geo_distance and geo_bbox
  - updating tests
  
0.0.9
  - added geo bounding box query support
  - added geo bbox tests 

0.0.8 
  - basic queries
    - geo distance
    - geo shape envelope
    - geo shape point
    - geo hash cell
    - reverse geo hash
  - tests that pass