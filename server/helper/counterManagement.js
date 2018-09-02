const express = require('express');
const mongoose = require('mongoose');
const CounterSchema = require('../sb_models/shared/counter');

module.exports.getNextSequence = (_model, _field, _prefix) => {    
    let prefixValue = String;
    let seqValue = String
    CounterSchema.findOne({ model: _model, field: _field }, (err, _counter) => {
        if(err) {
            return err
        } else {
            if(!_counter || _counter.length === 0) {
                let newCounter = new CounterSchema({
                    model: _model,
                    field: _field,
                    prefix: _prefix,
                    seq: 1
                });

                newCounter.save((err) => {
                    if(err) {
                        return err
                    } else {
                        console.log('New counter' + newCounter);
                        prefixValue = newCounter.prefix;
                        seqValue = newCounter.seq;
                    }
                });

            } else {
                prefixValue = _counter.prefix;
                seqValue = _counter.seq = _counter.seq + 1;
                _counter.save((err) => {
                    if (err) {
                        return err
                    }
                    else {
                        console.log('Counter' + _counter.prefix + _counter.seq);
                        return _counter.prefix + _counter.seq;
                    }
                })
            }
        }
    });
}