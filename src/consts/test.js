const rawData = {
  mindMap: { 
    "class": "go.TreeModel",
    "nodeDataArray": [
      {"key":0, "text":"Mind Map" },
      {"key":1, "parent":0,"estimatedDuration":50000, "text":"Getting more time", "node": "true", "active":"true"},
      {"key":11, "parent":1,"estimatedDuration":50000, "text":"Wake up early", "node": "true", "active":"false" },
      {"key":111, "parent":11,"estimatedDuration":500000, "text":"Woke up late", "node": "false" },
      {"key":112, "parent":11,"estimatedDuration":500000, "text":"Skipped breakfast", "node": "false"},
      {"key":113, "parent":11,"estimatedDuration":50000, "text":"Going to be late", "node": "false"},
      {"key":12, "parent":1,"estimatedDuration":50000, "text":"Delegate", "node": "true", "active":"false"},
      {"key":13, "parent":1,"estimatedDuration":50000, "text":"Simplify", "node": "true", "active":"false"},
      {"key":2, "parent":0,"estimatedDuration":50000, "text":"More effective use", "node": "true", "active":"false"},
      {"key":21, "parent":2,"estimatedDuration":50000, "text":"Planning", "node": "true", "active":"false"},
      {"key":211, "parent":21,"estimatedDuration":50000, "text":"Priorities", "node": "true", "active":"false"},
      {"key":212, "parent":21,"estimatedDuration":50000, "text":"Ways to focus", "node": "true", "active":"false"},
      {"key":22, "parent":2,"estimatedDuration":50000, "text":"Goals", "node": "true", "active":"false"}
    ]
  }
}

const data = rawData.mindMap.nodeDataArray;

export default data;