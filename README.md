# IOTA P2P Energy PoC

> This is currently a work in progress, see [./TODO.md](TODO.md) for more details.

This package is an implementation of the P2P Energy Blueprint [https://docs.iota.org/docs/blueprints/0.1/p2p-energy/overview](https://docs.iota.org/docs/blueprints/0.1/p2p-energy/overview)

## Demonstration

The Demonstration is a React Web UI with an API to back it which shows an overview of all the entities interacting.

See [./demo/README.md](./demo/README.md) for more details.

A deployed version of the demonstration is available at the following urls:

* demo - <https://iota-poc-p2p-energy-demo-client.dag.sh>
* api - <https://iota-poc-p2p-energy-demo-api.dag.sh>

## Standalone

The standalone folder contains examples of how to write `grid`, `producer`, `consumer`, `source` as standalone entities.

See [./standalone/README.md](./standalone/README.md) for more details.

## Common

Both the `demonstration` and the `standalone` packages share a large percentage of their code which can be found in the `common` library.