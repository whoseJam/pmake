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

const int N=605;
const int M=200005;
int n,Ind[N],tot,pos[N];
vector<int> look[N];

struct line{
	int Nxt,to;
}l[M];
int h[N],cnt;

void Link(int u,int v){
	l[++cnt]=(line){h[u],v};h[u]=cnt;Ind[v]++;
}

void Toposort(){
	queue<int>q;
	for(int i=1;i<=n;i++)
		if(!Ind[i])q.push(i);
	while(q.size()){
		int u=q.front();q.pop();
		tot++;
		for(int i=h[u],v;i;i=l[i].Nxt){
			v=l[i].to;
			Ind[v]--;
			if(!Ind[v])q.push(v);
		}
	}
	if(tot==n)cout<<"YES\n";
	else cout<<n-tot<<'\n';
}

int main(){
	n=read();
	for(int i=1,x,m;i<=n;i++){
		pos[i]=read();m=read();
		for(int j=1;j<=m;j++){
			look[i].push_back(read());
		}
	}
	for(int i=1;i<=n;i++){
		for(int j=0;j<look[i].size();j++){
			for(int k=1;k<=n;k++){
				if(pos[k]==look[i][j]){
					Link(i,k);
				}
			}
		}
	}
	Toposort();
	return 0;
}
