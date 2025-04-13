package pkg1.library;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="Fines")
public class FineEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="FineID")
	private int fineid;
	
	@ManyToOne
	@JoinColumn(name="MemberID",nullable=false)
	private MemberEntity memberid;
	
	@Column(name="FineAmount",precision=5,scale=2)
	private BigDecimal fineAmount;
	
	@Column(name = "PaymentStatus")
    private boolean paymentStatus;

	
	
	public FineEntity() {
		super();
	}
 
	public FineEntity(int fineid, MemberEntity memberid, BigDecimal fineAmount, boolean paymentStatus) {
		super();
		this.fineid = fineid;
		this.memberid = memberid;
		this.fineAmount = fineAmount;
		this.paymentStatus = paymentStatus;
	}

	public int getFineid() {
		return fineid;
	}

	public void setFineid(int fineid) {
		this.fineid = fineid;
	}

	public MemberEntity getMemberid() {
		return memberid;
	}

	public void setMemberid(MemberEntity memberid) {
		this.memberid = memberid;
	}

	public BigDecimal getFineAmount() {
		return fineAmount;
	}

	public void setFineAmount(BigDecimal fineAmount) {
		this.fineAmount = fineAmount;
	}

	public boolean isPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(boolean paymentStatus) {
		this.paymentStatus = paymentStatus;
	}


	
	
	

}
