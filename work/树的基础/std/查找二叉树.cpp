#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=100005;
int ch[N][2],val[N],n,x;

int Find(int id,int x){
	if(val[id]==x)return id;
	if(val[id]<x)return Find(ch[id][1],x);
	return Find(ch[id][0],x);
}

int main(){
	cin>>n>>x;
	for(int i=1;i<=n;i++){
		cin>>val[i]>>ch[i][0]>>ch[i][1];
	}
	cout<<Find(1,x);
	return 0;
}

