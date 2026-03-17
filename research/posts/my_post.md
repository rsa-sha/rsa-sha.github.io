## Setup

- ext4 filesystem
- 4KB append writes
- fsync after each write

## Observations

- Latency spikes every ~200ms
- Throughput drops significantly under sustained load

## Results

```json
{
  "throughput_ops_sec": 800,
  "p99_latency_ms": 120
}
