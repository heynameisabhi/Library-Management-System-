package pkg1.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pkg1.library.MemberEntity;
import pkg1.services.MemberService;

@RestController
@RequestMapping("/member")
public class MemberController {
	
	@Autowired
	private MemberService memberService;
	
	@GetMapping
	public List<MemberEntity> getAllMembers(@PathVariable int id){
		return memberService.getAllMembers();
	}
	
	@GetMapping("/{id}")
	public Optional<MemberEntity> getMemberById(@PathVariable int id){
		return memberService.getMemberById(id);
	}
	
	@PostMapping
	public MemberEntity addMember(@PathVariable  int id,@RequestBody MemberEntity member) {
	    return memberService.addMember(id,member);
	}

	
	@PutMapping("/{id}")
	public MemberEntity UpdateMember(@PathVariable int id,@RequestBody MemberEntity member) {
		return memberService.UpdateMember(id,member);
	}
	
	@DeleteMapping("/{id}")
	public void DeleteMember(@PathVariable int id) {
		memberService.DeleteMember(id);
	}

}
