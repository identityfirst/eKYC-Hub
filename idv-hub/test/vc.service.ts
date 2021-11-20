import 'mocha';
import { expect } from 'chai';
import {PassbaseService} from "../server/api/services/passbase.service";
import * as fs from "fs";
import * as path from "path";
import {VcService} from "../server/api/services/vc.service";

describe('Verification matching test', () => {
    it('should correctly translate driving license [value]', () =>{
        runMathingTest('./vcs/drivinglicense.json','./inputs/request_value_ok.json', './expected/response_value_ok.json')
    });

    it('should fail translate driving license [value]', () =>{
        runMathingTest('./vcs/drivinglicense.json','./inputs/request_value_fail.json', './expected/null.json')
    });

    it('should correctly translate driving license [null]', () =>{
        runMathingTest('./vcs/drivinglicense.json','./inputs/request_null_ok.json', './expected/response_null_ok.json')
    });

    it('should correctly translate driving license [values]', () =>{
        runMathingTest('./vcs/drivinglicense.json','./inputs/request_values_ok.json', './expected/response_values_ok.json')
    });

    it('should fail translate driving license [values]', () =>{
        runMathingTest('./vcs/drivinglicense.json','./inputs/request_values_fail.json', './expected/null.json')
    });

    it('should correctly translate driving license [max_age]', () =>{
        runMathingTest('./vcs/drivinglicense.json','./inputs/request_maxage_ok.json', './expected/response_maxage_ok.json')
    });

    it('should fail translate driving license [max_age]', () =>{
        runMathingTest('./vcs/drivinglicense.json','./inputs/request_maxage_fail.json', './expected/null.json')
    });

    it('should correctly translate driving license [essential]', () =>{
        runMathingTest('./vcs/drivinglicense.json','./inputs/request_essential_ok.json', './expected/response_essential_ok.json')
    });

    function runMathingTest(vcFile,inputFile,expectedFile){
        var request = JSON.parse(fs.readFileSync(path.resolve(__dirname, inputFile), 'utf8'));
        var vc = JSON.parse(fs.readFileSync(path.resolve(__dirname, vcFile), 'utf8'));
        var expected = JSON.parse(fs.readFileSync(path.resolve(__dirname, expectedFile), 'utf8'));
        var actual = new VcService().getVerifiedClaimsMatchingRequest(vc,request.userinfo.verified_claims)
        expect(actual).to.deep.equal(expected)
    }

});
