#include<iostream>
#include<cstring>
#include<cstdio>
#include<cmath>
#define LL long long
using namespace std;
int N,M;
LL val[100005];

struct segmentTree
{int L,R;LL Max,sum;}t[400005];

void pushUp(int x){
	t[x].Max=max(t[x*2].Max,t[x*2+1].Max);
	t[x].sum=t[x*2].sum+t[x*2+1].sum;
}

void buildTree(int Left,int Right,int x){
	t[x].L=Left;t[x].R=Right;
	if(Left==Right){
		t[x].sum=t[x].Max=val[Left];
		return;
	}
	int mid=(Left+Right)/2;
	buildTree(Left,mid,x*2);
	buildTree(mid+1,Right,x*2+1);
	pushUp(x);
}

void CutDown(int Left,int Right,int x){
	if(t[x].L>Right||t[x].R<Left)return;
	if(t[x].L==t[x].R&&t[x].L>=Left&&t[x].L<=Right){
		t[x].sum=(LL)sqrt(t[x].sum);
		t[x].Max=(LL)sqrt(t[x].Max);
		return;
	}
	if(t[x*2].Max>1)CutDown(Left,Right,x*2);
	if(t[x*2+1].Max>1)CutDown(Left,Right,x*2+1);
	pushUp(x);
}

LL getSum(int Left,int Right,int x){
	if(t[x].L>Right||t[x].R<Left)return 0;
	if(Left<=t[x].L&&t[x].R<=Right)return t[x].sum;
	return getSum(Left,Right,x*2)+getSum(Left,Right,x*2+1);
}

int main(){
	scanf("%d",&N);
	for(int i=1;i<=N;i++)scanf("%lld",&val[i]);
	buildTree(1,N,1);
	
	int opt,L,R;
	scanf("%d",&M);
	for(int i=1;i<=M;i++){
		scanf("%d%d%d",&opt,&L,&R);
		if(L>R)swap(L,R);
		if(opt==0)CutDown(L,R,1);
		if(opt==1)printf("%lld\n",getSum(L,R,1));
	}
	return 0;
}
