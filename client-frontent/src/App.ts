import { RtcPairSocket } from 'rtc-pair-socket';
import AsyncQueue from './AsyncQueue';
import assert from './assert';
import generateProtocol from './generateProtocol';

interface InsurancePolicyhProfile {
  age: {
    min: number;
    max: number;
  };
  gender: "male" | "female" | "other";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  exercise: {
    frequency: "daily" | "weekly" | "monthly" | "rarely";
    duration: number; // in minutes
  };
  medicalConditions: [string];
}

interface PersonHealthProfile {
  age: number;
  gender: "male" | "female" | "other";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  exercise: {
    frequency: "daily" | "weekly" | "monthly" | "rarely";
    duration: number; // in minutes
  };
  medicalConditions: [string];
}


export default class App {
  socket?: RtcPairSocket;
  party?: 'alice' | 'bob';
  peer?: 'customer' | 'provider';

  msgQueue = new AsyncQueue<unknown>();

  generateJoiningCode() {
    // 128 bits of entropy
    return [
      Math.random().toString(36).substring(2, 12),
      Math.random().toString(36).substring(2, 12),
      Math.random().toString(36).substring(2, 7),
    ].join('');
  }

  async connect(code: string, party: 'alice' | 'bob') {
    this.party = party;
    const socket = new RtcPairSocket(code, party);
    this.socket = socket;

    socket.on('message', (msg: unknown) => {
      // Using a message queue instead of passing messages directly to the MPC
      // protocol ensures that we don't miss anything sent before we begin.
      this.msgQueue.push(msg);
    });

    await new Promise<void>((resolve, reject) => {
      socket.on('open', resolve);
      socket.on('error', reject);
    });
  }



  async find_insurar(value: PersonHealthProfile): Promise<number> {
    const { peer, socket } = this;
    let party = peer;


    assert(party !== undefined, 'Party must be set');
    assert(socket !== undefined, 'Socket must be set');

    const input = party === 'customer' ? { a: value } : { b: value };
    const otherParty = party === 'customer' ? 'customer' : 'provider';

    const protocol = await generateProtocol();

    const session = protocol.join(
      party,
      input,
      (to, msg) => {
        assert(to === otherParty, 'Unexpected party');
        socket.send(msg);
      },
    );

    this.msgQueue.stream((msg: unknown) => {
      if (!(msg instanceof Uint8Array)) {
        throw new Error('Unexpected message type');
      }

      session.handleMessage(otherParty, msg);
    });

    const output = await session.output();

    if (
      output === null
      || typeof output !== 'object'
      || typeof output.main !== 'number'
    ) {
      throw new Error('Unexpected output');
    }

    return output.main;
  }

  async mpcLargest(value: number): Promise<number> {
    const { party, socket } = this;

    assert(party !== undefined, 'Party must be set');
    assert(socket !== undefined, 'Socket must be set');

    const input = party === 'alice' ? { a: value } : { b: value };
    const otherParty = party === 'alice' ? 'bob' : 'alice';

    const protocol = await generateProtocol();

    const session = protocol.join(
      party,
      input,
      (to, msg) => {
        assert(to === otherParty, 'Unexpected party');
        socket.send(msg);
      },
    );

    this.msgQueue.stream((msg: unknown) => {
      if (!(msg instanceof Uint8Array)) {
        throw new Error('Unexpected message type');
      }

      session.handleMessage(otherParty, msg);
    });

    const output = await session.output();

    if (
      output === null
      || typeof output !== 'object'
      || typeof output.main !== 'number'
    ) {
      throw new Error('Unexpected output');
    }

    return output.main;
  }
}
