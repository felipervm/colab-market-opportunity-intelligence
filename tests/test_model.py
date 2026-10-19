import csv,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class TestMarketCase(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  with (ROOT/'data/opportunity_assumptions.csv').open(encoding='utf-8',newline='') as f:cls.rows=list(csv.DictReader(f))
 def test_five_segments(self):self.assertEqual(len(self.rows),5)
 def test_unique_segments(self):self.assertEqual(len(set(r['segment'] for r in self.rows)),5)
 def test_score_range(self):
  for r in self.rows:
   for k in ['product_fit','public_evidence','potential_impact','sales_accessibility','testability']:
    self.assertTrue(1<=int(r[k])<=5)
 def test_all_source_links(self):self.assertTrue(all(r['source'].startswith('https://') for r in self.rows))
 def test_evidence_has_named_signals(self):self.assertTrue(all(r['observable_public_signals'] for r in self.rows))
 def test_weights_normalize(self):
  w=[25,25,20,15,15]
  for r in self.rows:
   total=sum(int(r[k])*w[i] for i,k in enumerate(['product_fit','public_evidence','potential_impact','sales_accessibility','testability']))/sum(w)
   self.assertTrue(1<=total<=5)
 def test_sources_ledger(self):
  import json
  ledger=json.loads((ROOT/'data/sources.json').read_text())
  self.assertGreaterEqual(len(ledger),5)
  self.assertTrue(all(x['url'].startswith('https://') for x in ledger))
if __name__=='__main__':unittest.main()
