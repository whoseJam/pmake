#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

const int MAXN=100005;
int fa[MAXN],ch[MAXN][2],siz[MAXN],val[MAXN];
int N,M,Q,Im[MAXN];

void pushUp(int x){
	siz[x]=siz[ch[x][0]]+siz[ch[x][1]]+1;
}

void rotate(int x,int &f){
	int y=fa[x],z=fa[y],L=(ch[y][0]!=x),R=L^1;
	if(y==f)f=x;else if(ch[z][0]==y)ch[z][0]=x;else ch[z][1]=x;
	fa[x]=z;fa[y]=x;fa[ch[x][R]]=y;
	ch[y][L]=ch[x][R];ch[x][R]=y;
	pushUp(y);pushUp(x);
}

void Splay(int x,int &f){
	while(x!=f){
		int y=fa[x],z=fa[y];
		if(y!=f){
			if((ch[z][0]==y)^(ch[y][0]==x))rotate(x,f);
			else rotate(y,f);
		}
		rotate(x,f);
	}
}

void Insert(int x,int value,int newPos){
	if(val[x]>value&&ch[x][0])Insert(ch[x][0],value,newPos);
	else if(val[x]<=value&&ch[x][1])Insert(ch[x][1],value,newPos);
	else{
		if(val[x]>value)ch[x][0]=newPos;
		else ch[x][1]=newPos;
		val[newPos]=value;fa[newPos]=x;siz[newPos]=1;
	}
	pushUp(x);
}

void Add(int x,int newPos){
	if(x==newPos)return;
	Insert(x,val[newPos],newPos);
	Splay(newPos,x);
}

int getRoot(int k){
	if(fa[k]==0)return k;
	return getRoot(fa[k]);
}

int FindK(int x,int k){
	if(siz[ch[x][0]]+1==k)return x;
	else if(siz[ch[x][0]]>=k)return FindK(ch[x][0],k);
	else return FindK(ch[x][1],k-siz[ch[x][0]]-1);
}

void DFS(int now,int Root){
	if(ch[now][0])DFS(ch[now][0],Root);
	if(ch[now][1])DFS(ch[now][1],Root);
	Add(Root,now);
}

int main(){
	int x,y;
	scanf("%d%d",&N,&M);
	for(int i=1;i<=N;i++)scanf("%d",&val[i]),siz[i]=1;
	for(int i=1;i<=M;i++){
		scanf("%d%d",&x,&y);
		int p1=getRoot(x),p2=getRoot(y);
		if(p1!=p2){
			if(siz[p1]>siz[p2])swap(p1,p2);
			DFS(p1,p2);
		}
	}
	
	scanf("%d",&Q);char opt[3];
	for(int i=1;i<=Q;i++){
		scanf("%s%d%d",&opt,&x,&y);
		if(opt[0]=='Q'){
			int p=getRoot(x);
			if(siz[p]<y){printf("-1\n");continue;}
			printf("%d\n",FindK(p,y));
		}
		if(opt[0]=='B'){
			int p1=getRoot(x),p2=getRoot(y);
			if(p1==p2)continue;
			if(siz[p1]>siz[p2])swap(p1,p2);
			DFS(p1,p2);
		}
	}
	return 0;
}
