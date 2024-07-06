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

const int N=200005;
int n,m,mx[N][20];

int Query(int l,int r){
	int k=log2(r-l+1);
	return max(mx[l][k],mx[r-(1<<k)+1][k]);
}

int main(){
	n=read();
	for(int i=1;i<=n;i++)mx[i][0]=read();
	for(int j=1;(1<<j)<=n;j++)
		for(int i=1;i+(1<<j)-1<=n;i++)
			mx[i][j]=max(mx[i][j-1],mx[i+(1<<j-1)][j-1]);
	m=read();
	for(int i=1;i<=m;i++){
		int l=read(),r=read();
		cout<<Query(l,r)<<'\n';
	}
	return 0;
}

