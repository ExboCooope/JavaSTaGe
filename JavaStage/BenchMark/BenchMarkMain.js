/**
 * Created by Exbo on 2015/10/16.
 */
var benchMarkItem=[];
var currentBenchMark=-1;


function nextBenchMark(){
    if(benchMarkItem[currentBenchMark]){
        benchMarkItem[currentBenchMark].endTime=(new Date()).getTime();
        benchMarkItem[currentBenchMark].result();
    }
    currentBenchMark++;
    if(benchMarkItem[currentBenchMark]){
        benchMarkItem[currentBenchMark].startTime=(new Date()).getTime();
        benchMarkItem[currentBenchMark].script();
    }
}

function BenchMark(){
    this.result=null;
    this.script=null;
    this.endTime=0;
    this.startTime=0;
    benchMarkItem.push(this);
}