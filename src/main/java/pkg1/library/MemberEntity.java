package pkg1.library;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Members")
public class MemberEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="MemberID")
	private int memberid;
	
	@Column(name="Name",nullable=false)
	private String name;
	
	@Column(name="Address",columnDefinition = "TEXT")
	private String address;
	
	@Column(name="PhoneNumber",length=10)
	private int phoneNumber;
	
	@Column(name="Email",unique = true)
	private String email;
	
	@Enumerated(EnumType.STRING)
    @Column(name = "Membership_Type")
    private MembershipType membershipType;
	
    public enum MembershipType {
        REGULAR,
        PREMIUM,
        STUDENT
    }

	public MemberEntity() {
		super();
	}
	
	

	public MemberEntity(int memberid, String name, String address, int phoneNumber, String email,
			MembershipType membershipType) {
		super();
		this.memberid = memberid;
		this.name = name;
		this.address = address;
		this.phoneNumber = phoneNumber;
		this.email = email;
		this.membershipType = membershipType;
	}



	public int getMemberid() {
		return memberid;
	}

	public void setMemberid(int memberid) {
		this.memberid = memberid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public int getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(int phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public MembershipType getMembershipType() {
		return membershipType;
	}

	public void setMembershipType(MembershipType membershipType) {
		this.membershipType = membershipType;
	}
	
    
	

}
