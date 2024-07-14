#include<iostream>
#include<cstdio>
using namespace std;

const int N=1000005;
string a;
int nxt[N];

void getNext(){
	int i,cur=0;
	nxt[1]=0;
	for(int i=2;i<=a.length()-1;i++){
		while(cur>0&&a[i]!=a[cur+1])cur=nxt[cur];
		if(a[i]==a[cur+1])cur++;
		nxt[i]=cur;
	}
}

int main(){
	while(true){
		cin>>a;
		if(a==".")break;
		a=' '+a;
		
		getNext();
		int len=a.length()-1;
		if(len%(len-nxt[len])==0)cout<<len/(len-nxt[len])<<endl;
		else cout<<"1"<<endl;
	}
	return 0;
}
