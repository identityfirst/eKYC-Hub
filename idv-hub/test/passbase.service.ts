import 'mocha';
import { expect } from 'chai';
import {PassbaseService} from "../server/api/services/passbase.service";
import * as fs from "fs";
import * as path from "path";

describe('Passbase service tests', () => {
    it('should correctly translate driving license', () =>{
        var input = JSON.parse(fs.readFileSync(path.resolve(__dirname, './inputs/passbase_drivinglicense.json'), 'utf8'));
        var expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, './vcs/drivinglicense.json'), 'utf8'));
        var actual = new PassbaseService().translate(input)
        console.log(JSON.stringify(actual,null,2))
        expect(actual).to.deep.equal(expected)
    });

});