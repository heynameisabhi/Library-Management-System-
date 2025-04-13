package pkg1.library;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="Staff")
public class StaffEntity {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="StaffID")
	private int staffid;
	
	@Column(name="Name",nullable=false)
	private String name;
	
	@Column(name="Role",nullable=false)
	private String role;
	
	@Column(name="ContactInformation",length=100)
	private String contactinformation;

	public StaffEntity() {
		super();
	}

	public StaffEntity(int staffid, String name, String role, String contactinformation) {
		super();
		this.staffid = staffid;
		this.name = name;
		this.role = role;
		this.contactinformation = contactinformation;
	}

	public int getStaffid() {
		return staffid;
	}

	public void setStaffid(int staffid) {
		this.staffid = staffid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getContactinformation() {
		return contactinformation;
	}

	public void setContactinformation(String contactinformation) {
		this.contactinformation = contactinformation;
	}
	
	
	
	

}
