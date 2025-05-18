package pkg1.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import pkg1.library.MemberEntity;
import pkg1.library.MemberRepo;

@Service
public class MemberService {
    
    @Autowired
    private MemberRepo memberrepo;

    public List<MemberEntity> getAllMembers() {
        return memberrepo.findAll();
    }

    public Optional<MemberEntity> getMemberById(int id) {
        return memberrepo.findById(id);
    }

    public MemberEntity addMember(MemberEntity member) {
        return memberrepo.save(member);
    }

    public MemberEntity updateMember(int id, MemberEntity member) {
        member.setMemberid(id);
        return memberrepo.save(member);
    }

    public void deleteMember(int id) {
        memberrepo.deleteById(id);
    }
}
