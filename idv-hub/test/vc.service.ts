import 'mocha';
import { expect } from 'chai';
import {PassbaseService} from "../server/api/services/passbase.service";
import * as fs from "fs";
import * as path from "path";
import {VcService} from "../server/api/services/vc.service";

describe('Verification matching test', () => {
    it('should correctly translate driving license 1 ', () =>{
        var request = JSON.parse(fs.readFileSync(path.resolve(__dirname, './inputs/request1.json'), 'utf8'));
        var vc = JSON.parse(fs.readFileSync(path.resolve(__dirname, './vcs/drivinglicense.json'), 'utf8'));
        var expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, './vcs/request1_vc.json'), 'utf8'));
        var actual = new VcService().getVerifiedClaimsMatchingRequest(vc,request.userinfo.verified_claims)
        expect(actual).to.deep.equal(expected)
    });

    it('should correctly translate driving license 2', () =>{
        var request = JSON.parse(fs.readFileSync(path.resolve(__dirname, './inputs/request2.json'), 'utf8'));
        var vc = JSON.parse(fs.readFileSync(path.resolve(__dirname, './vcs/drivinglicense.json'), 'utf8'));
        var expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, './vcs/request2_vc.json'), 'utf8'));
        var actual = new VcService().getVerifiedClaimsMatchingRequest(vc,request.userinfo.verified_claims)
        expect(actual).to.deep.equal(expected)
    });

});