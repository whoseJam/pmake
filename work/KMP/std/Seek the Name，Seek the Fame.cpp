#include<iostream>
#include<cstdio>
using namespace std;

const int N=400005;
int nxt[N],ans[N],cnt;

int getNext(string a){
	int cur=0;
	nxt[1]=0;
	for(int i=2;i<=a.length()-1;i++){
		while(cur>0&&a[cur+1]!=a[i])cur=nxt[cur];
		if(a[cur+1]==a[i])cur++;
		nxt[i]=cur;
	}
}

int main(){
	string a;
	while(cin>>a){
		a=' '+a;
		getNext(a);
		
		cnt=0;
		int cur=a.length()-1;
		while(cur>0){
			cnt++;
			ans[cnt]=cur;
			cur=nxt[cur];
		}
		for(int i=cnt;i>=1;i--)cout<<ans[i]<<" ";
		cout<<endl;
	}
	return 0;
}
