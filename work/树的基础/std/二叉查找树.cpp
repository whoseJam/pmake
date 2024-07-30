#include<bits/stdc++.h>
using namespace std;

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