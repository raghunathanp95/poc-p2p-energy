# IOTA P2P Energy PoC

> This is currently a work in progress, see [./TODO.md](TODO.md) for more details.

This package is an implementation of the P2P Energy Blueprint [https://docs.iota.org/docs/blueprints/0.1/p2p-energy/overview](https://docs.iota.org/docs/blueprints/0.1/p2p-energy/overview)

The IOTA P2P Energy PoC Demonstration is composed of 5 packages `demo`, `grid`, `producer`, `source` and `consumer`.

## Demo

The Demo is a React Web UI which shows an overview of the other entities interacting.

See [./demo/README.md](./demo/README.md) for more details.

## Grid

The Grid facilitates all the services required by `producers` and `consumers`.
It is a set of services running on NodeJS connecting to the Tangle, Amazon S3, Amazon DynamoDB.

See [./grid/README.md](./grid/README.md) for more details.

## Producer

The Producer package provides the features required by `sources`.
It is a set of services running on NodeJS connecting to the Tangle and the Grid.

See [./producer/README.md](./producer/README.md) for more details.

## Source

The Source package provides the features required by a `source`.
It is an element connecting to the Producer API.

See [./source/README.md](./source/README.md) for more details.

## Consumer

The Consumer package provides the features required by a `consumer`.
It is an element connecting to the Grid API.

See [./consumer/README.md](./consumer/README.md) for more details.

# Deployed

A demonstration version of the application is deployed at the following urls:

* demo - <https://iota-poc-p2p-energy.dag.sh>
