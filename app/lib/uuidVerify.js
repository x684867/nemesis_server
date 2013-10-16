/*

	UUID Verification Class (Generic)
	/srv/nemesis/app/library/uuidVerify.js
	(c) 2013 Sam Caldwell.  All Rights Reserved.

	This class will verify that a given UUID is properly formatted as a 
	UUID string and that the UUID exists as the correct type in the 
	Nemesis store.
	
	This class requires the storeMgmtClass.
*/
module.exports=uuidVerify;

function uuidVerify(proposedUUIDstring){
	/*
	
		Step #1: Verify that the uuid string matches the pattern of the UUID
				 This will save us time and energy doing an expensive store
				 lookup.
	
				 Example Pattern:
				 
					Xe12-43bd-22c6-6e76-c2ba-9edd-c1f9-1394-e57f-9f83
	 */
	
	if(!test(new RegExp(/\X[0-9a-f]{3}\-[0-9a-f]{4}\-[0-9a-f]{4}/))) return false;
	/*continued execution means we have a valid uuid pattern*/	
	
	/*
	
		Step #2: 

}